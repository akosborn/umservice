import groovy.json.JsonSlurper

class Transformer {
    public static Object getTracks(String body) {
        Object bodyAsJson = toJson(body);
        return bodyAsJson;
    }

    public static Map toJson(String body) {
        return new JsonSlurper().parseText(body) as Map;
    }
}
