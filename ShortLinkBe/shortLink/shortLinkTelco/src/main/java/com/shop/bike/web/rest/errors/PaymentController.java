package com.shop.bike.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/consumer/public/")
public class PaymentController {

    private final String HITPAY_API_KEY = "f6a91725e2d165bdc4d69c5da3e21406487e60d93252bef04d53a23e820fc09b";
    private final String HITPAY_BASE_URL = "https://sandbox.hitpayapp.com";

    @PostMapping("/payments/create")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> paymentRequest) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + HITPAY_API_KEY);
        headers.set("Content-Type", "application/json");

        // Body for the HitPay API
        Map<String, Object> body = new HashMap<>();
        body.put("amount", paymentRequest.get("amount"));
        body.put("currency", "SGD");
        body.put("payment_methods", "credit_card");
        body.put("redirect_url", "http://localhost:3000/payment-success");
        body.put("webhook", "http://your-server.com/api/payments/webhook");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(HITPAY_BASE_URL + "/payment-requests", entity, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            System.out.println("Error details: " + e);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> webhookData) {
        // Handle webhook response here
        System.out.println("Webhook Data: " + webhookData);
        return ResponseEntity.ok("Webhook received successfully.");
    }
}
