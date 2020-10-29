import okhttp3.*;

import java.io.IOException;

public class Application {
    public static void main(String[] args) {
        init();
    }

    private static void init() {
        OkHttpClient client = new OkHttpClient();

        String url = "http://www.umlive.net/api.aspx?method=catalog.container&containerID=25483";
        Request request = new Request.Builder()
                .url(url)
                .addHeader("Accept", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            ResponseBody respBody = response.body();
            if (respBody != null) {
                String jsonString = respBody.string();
                System.out.println(Transformer.getTracks(jsonString));
            }
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
        }
    }
}