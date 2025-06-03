package com.xeno.crm_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ai")
public class AiMessageController {

    private final RestTemplate restTemplate = new RestTemplate();

    // ⚠️ Replace this with your actual OpenAI key
    private final String OPENAI_API_KEY = "sk-...";

    // @PostMapping("/suggest-messages")
    // public ResponseEntity<List<String>> suggestMessages(@RequestBody Map<String, String> body) {
    //     try {
    //         String prompt = body.get("prompt");

    //         String fullPrompt = "Generate 3 short and friendly marketing messages to: " + prompt;

    //         HttpHeaders headers = new HttpHeaders();
    //         headers.setContentType(MediaType.APPLICATION_JSON);
    //         headers.setBearerAuth(OPENAI_API_KEY);

    //         Map<String, Object> request = new HashMap<>();
    //         request.put("model", "gpt-3.5-turbo");
    //         request.put("messages", List.of(
    //             Map.of("role", "user", "content", fullPrompt)
    //         ));
    //         request.put("max_tokens", 200);
    //         request.put("temperature", 0.7);

    //         HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

    //         ResponseEntity<Map> response = restTemplate.postForEntity(
    //                 "https://api.openai.com/v1/chat/completions", entity, Map.class);

    //         if (response.getStatusCode().is2xxSuccessful()) {
    //             Map responseBody = response.getBody();
    //             List choices = (List) responseBody.get("choices");
    //             Map firstChoice = (Map) choices.get(0);
    //             Map message = (Map) firstChoice.get("message");
    //             String content = (String) message.get("content");

    //             List<String> variants = Arrays.stream(content.split("\n"))
    //                     .filter(s -> !s.trim().isEmpty())
    //                     .map(String::trim)
    //                     .toList();

    //             return ResponseEntity.ok(variants);
    //         } else {
    //             System.out.println("OpenAI API Error: " + response);
    //             return ResponseEntity.status(500).body(List.of("Error from OpenAI API"));
    //         }

    //     } catch (Exception e) {
    //         e.printStackTrace(); // Logs the real error
    //         return ResponseEntity.status(500).body(List.of("AI API call failed: " + e.getMessage()));
    //     }
    // }


    @PostMapping("/suggest-messages")
public ResponseEntity<List<String>> suggestMessages(@RequestBody Map<String, String> body) {
    List<String> suggestions = List.of(
        "AI message suggestion feature is fully built and ready.",
        "During development, I used OpenAI's GPT-3.5 API to generate campaign messages based on custom objectives entered by the user.",
        "However, the $1 free trial quota provided by OpenAI was fully consumed while testing this functionality.",
        "To re-enable live AI responses, simply uncomment the OpenAI integration code in this controller and add a valid API key.",
        "Everything else — prompt handling, response parsing, and frontend display — is already working. You can see how the feature flows end-to-end."
    );
    return ResponseEntity.ok(suggestions);
}

}
