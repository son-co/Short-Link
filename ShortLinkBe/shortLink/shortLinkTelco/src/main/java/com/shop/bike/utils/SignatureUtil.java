package com.shop.bike.utils;

import java.util.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

public class SignatureUtil {

    public static String generateSign(Map<String, String> params, String privateKey) {
        // step 1: remove value null or empty
        Map<String, String> filteredParams = new HashMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                filteredParams.put(entry.getKey(), entry.getValue());
            }
        }

        // Bước 2: order by ASCII (dictionary order)
        List<String> sortedKeys = new ArrayList<>(filteredParams.keySet());
        Collections.sort(sortedKeys);
        

        // Bước 3: create string like style key=value and connect = &
        StringBuilder stringA = new StringBuilder();
        for (int i = 0; i < sortedKeys.size(); i++) {
            String key = sortedKeys.get(i);
            String value = filteredParams.get(key);
            if (i == 0) {
                stringA.append(key).append("=").append(value);
            } else {
                stringA.append("&").append(key).append("=").append(value);
            }
        }

        // Bước 4: add (private key) to end of string
        stringA.append("&key=").append(privateKey);

        // Bước 5: encrypt MD5 and convert to upperCase
        System.out.println("String A: "+ stringA + "\n");
        String signValue = md5(stringA.toString()).toUpperCase();
        return signValue;
    }

    // encrypt MD5
    public static String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashInBytes = md.digest(input.getBytes(StandardCharsets.UTF_8));

            // convert byte array to array hex
            StringBuilder sb = new StringBuilder();
            for (byte b : hashInBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        // parameter
        Map<String, String> signMap = new HashMap<>();
        signMap.put("amount", "100");
        signMap.put("mchOrderNo", "mho1725423431189");
        signMap.put("subject", "Product Title");
        signMap.put("wayCode", "PH_SM");
        signMap.put("reqTime", "1725471225207");
        signMap.put("body", "Product Description");
        signMap.put("version", "1.0");
        signMap.put("appId", "66bca66fe4b0fb8d90a008f9");
        signMap.put("notifyUrl", "https://www.bosspay.com/notify.html");
        signMap.put("signType", "MD5");
        signMap.put("currency", "PHP");
        signMap.put("mchNo", "M1723639407");

        // private key
        String privateKey = "7pZqH254we5N679C344EKkLNd3FzMIfkSN8Bib4wvuqHF8ism6Xg4Yb39UpsfilKF1jl91gyLgRtCHiz96DIqqJSdTGZNv2F4ixA0V43RtXNJme1qUFLhacjPXvooJAa";

        // create sign
        String sign = generateSign(signMap, privateKey);
        System.out.println("Signature result: " + sign);
    }
}
