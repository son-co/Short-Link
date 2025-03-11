package com.shop.bike.service.impl;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.shop.bike.entity.ShortLinkDO;
import com.shop.bike.repository.ClickCountRepository;
import com.shop.bike.repository.ShortLinkRepository;
import com.shop.bike.security.SecurityUtils;
import com.shop.bike.service.ShortLinkFilterDTO;
import com.shop.bike.service.ShortLinkService;
import com.shop.bike.service.feign.dto.ShortLinkCreateReqDTO;
import com.shop.bike.service.feign.vm.Result;
import com.shop.bike.service.feign.vm.Results;
import com.shop.bike.service.feign.vm.ShortLinkCreateRespDTO;
import com.shop.bike.service.feign.vm.ShortLinkTitleRespDTO;
import com.shop.bike.utils.JsonConverter;
import com.shop.bike.vm.ShortLinkVM;
import com.shop.bike.vm.StatisticOverview;
import com.shop.bike.vm.mapper.ShortLinkVMMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
@Transactional
@Primary
@Slf4j
public class ShortLinkServiceImpl implements ShortLinkService {

    @Autowired
    private ShortLinkVMMapper vmMapper;

    @Autowired
    private ShortLinkRepository shortLinkRepository;
    
    @Autowired
    private ClickCountRepository clickCountRepository;


    @Override
    public ShortLinkCreateRespDTO createShortLink(ShortLinkCreateReqDTO requestParam) {
        try {
            String apiUrl = "http://localhost:8101/api/short-link/v1/create";

            // Prepare the request body
            JSONObject requestBody = new JSONObject();
            requestBody.put("domain", requestParam.getDomain());
            requestBody.put("originUrl", requestParam.getOriginUrl());
            requestBody.put("gid", requestParam.getGid());
            requestBody.put("createdType", requestParam.getCreatedType());
            requestBody.put("validDateType", requestParam.getValidDateType()); // Corrected here
            requestBody.put("validDate", requestParam.getValidDate());
            requestBody.put("describe", requestParam.getDescribe());

            // Make the API call
            HttpURLConnection connection = createConnection(apiUrl);
            sendRequest(connection, requestBody.toString());
            String response = getResponse(connection);

            // Initialize ObjectMapper
            ObjectMapper objectMapper = new ObjectMapper();

            // Deserialize the response into ShortLinkCreateRespDTO
            String title = getTitle(requestParam.getOriginUrl());
            
            log.debug("get favicon");
            String favicon = getFavicon(requestParam.getOriginUrl());
            
            ShortLinkCreateRespDTO responseDTO = objectMapper.readValue(response, ShortLinkCreateRespDTO.class);
            saveShortLink(requestParam, responseDTO, title, favicon);
            responseDTO.setTitle(title);
            responseDTO.setFavicon(favicon);
            responseDTO.setValidDate(requestParam.getValidDate());
            return responseDTO;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SneakyThrows
    private String getFavicon(String url) {
        try {
            Document document = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
                    .header("Referer", "https://www.google.com")
                    .header("Accept-Language", "en-US,en;q=0.9")
                    .timeout(10000)
                    .ignoreHttpErrors(true)
                    .get();

            // Tìm favicon trong HTML
            Element faviconLink = document.select("link[rel~=(?i)^(shortcut )?icon]").first();
            if (faviconLink != null) {
                return faviconLink.attr("abs:href");
            }

            // Nếu không tìm thấy, dùng favicon mặc định
            URL targetUrl = new URL(url);
            return targetUrl.getProtocol() + "://" + targetUrl.getHost() + "/favicon.ico";

        } catch (Exception e) {
            System.err.println("❌ Lỗi khi lấy favicon: " + e.getMessage());
        }
        return null;
    }

    private static final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)  // Thời gian kết nối tối đa
            .readTimeout(30, TimeUnit.SECONDS)     // Thời gian đọc dữ liệu tối đa
            .build();
    

    @SneakyThrows
    public String getTitle(String url) {
        try {
            // Tạo request với giả lập User-Agent
            Request request = new Request.Builder()
                    .url(url)
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
                    .header("Referer", "https://www.google.com")
                    .header("Accept-Language", "en-US,en;q=0.9")
                    .build();

            // Gửi request
            Response response = client.newCall(request).execute();
            if (!response.isSuccessful()) {
                System.err.println("❌ Lỗi HTTP: " + response.code());
                return null;
            }

            // Parse HTML từ response
            Document document = Jsoup.parse(response.body().string(), url);
            return document.title();
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi lấy title: " + e.getMessage());
        }
        return null;
    }

    public String formatJson(String jsonString) {
        try {
            // Tạo ObjectMapper cho JSON parsing
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

            // Đọc chuỗi JSON và chuyển thành Object
            Object jsonObject = objectMapper.readValue(jsonString, Object.class);

            // Ghi Object ra chuỗi với format đẹp
            return objectMapper.writeValueAsString(jsonObject);

        } catch (Exception e) {
            e.printStackTrace();
            return "Invalid JSON format";
        }
    }

    @Override
    public Page<ShortLinkVM> findAllShortLink(ShortLinkFilterDTO filterDTO, Pageable pageable) {
        return shortLinkRepository.findAllWithFilter(filterDTO.getId(),
                filterDTO.getDomain(), filterDTO.getShortUri(), filterDTO.getFullShortUrl(),
                filterDTO.getOriginUrl(), filterDTO.getValidDateFrom(), filterDTO.getValidDateTo(),
                        SecurityUtils.getCurrentUserLogin().get(),pageable)
                .map(shortLinkDO -> {
                    ShortLinkVM vm = vmMapper.toDto(shortLinkDO);
                    vm.setTotalClick(clickCountRepository.getTotalClick(vm.getShortUri()));
                    return vm;
                });
    }

    @Override
    public StatisticOverview getOverview() {
        // Lấy ngày đầu tháng và ngày cuối tháng
        Instant firstDayOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant lastDayOfMonth = LocalDate.now().plusMonths(1).withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Integer linkThisMonth = shortLinkRepository.getStatistic(firstDayOfMonth, lastDayOfMonth);
        StatisticOverview statisticOverview = new StatisticOverview();
        statisticOverview.setAllUrls(shortLinkRepository.getStatistic(null, null));
        statisticOverview.setLinkAddedThisMonth(linkThisMonth);
        statisticOverview.setTotalClicks(Integer.parseInt(String.valueOf(clickCountRepository.count())));
        
        //get link increment
        Instant DayOfMonthBefore = LocalDate.now().withDayOfMonth(1) // Lấy ngày đầu tiên của tháng hiện tại
                .minusDays(1) // Lùi lại 1 ngày để lấy ngày cuối của tháng trước
                .atStartOfDay(ZoneId.systemDefault()).toInstant();

        Instant firstDayOfMonthBefore = LocalDate.now().minusMonths(1) // Lùi 1 tháng
                .withDayOfMonth(1) // Lấy ngày đầu tiên của tháng đó
                .atStartOfDay(ZoneId.systemDefault()).toInstant();

        Integer lastMonthStatistic = shortLinkRepository.getStatistic(DayOfMonthBefore, firstDayOfMonthBefore);
        lastMonthStatistic = (lastMonthStatistic == null || lastMonthStatistic == 0) ? 1 : lastMonthStatistic;

        Double percent = ((linkThisMonth / (double) lastMonthStatistic) * 100.0);


        statisticOverview.setLinkIncrement(percent);
        return statisticOverview;
    }


    private void saveShortLink(ShortLinkCreateReqDTO requestParam, ShortLinkCreateRespDTO responseDTO, String title, String favicon) {
        ShortLinkDO shortLinkDO = new ShortLinkDO();
        shortLinkDO.setDomain(requestParam.getDomain());
        shortLinkDO.setFullShortUrl(responseDTO.getData().getFullShortUrl());
        shortLinkDO.setShortUri(responseDTO.getData().getFullShortUrl().replaceAll("https://api.shrsms.com/",""));
        shortLinkDO.setOriginUrl(requestParam.getOriginUrl());
        shortLinkDO.setClickNum(0);
        shortLinkDO.setGid(requestParam.getGid());
        shortLinkDO.setEnableStatus(0);
        shortLinkDO.setCreatedType(0);
        shortLinkDO.setValidDateType(requestParam.getValidDateType());
        shortLinkDO.setValidDate(Date.from(Instant.now()));
        shortLinkDO.setDescribe(requestParam.getDescribe());
        shortLinkDO.setFavicon(favicon);
        shortLinkDO.setTotalPv(0);
        shortLinkDO.setTotalUv(0);
        shortLinkDO.setTotalUip(0);
        shortLinkDO.setDelTime(0L);
        shortLinkDO.setTitle(title);
        shortLinkRepository.save(shortLinkDO);
    }



    private static HttpURLConnection createConnection(String apiUrl) throws Exception {
        URL url = new URL(apiUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        return connection;
    }

    private static void sendRequest(HttpURLConnection connection, String jsonBody) throws Exception {
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
    }

    private static String getResponse(HttpURLConnection connection) throws Exception {
        StringBuilder response = new StringBuilder();
        try (var reader = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        }
        return response.toString();
    }


}