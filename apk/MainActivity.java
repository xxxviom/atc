package io.github.xxxviom.atc;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private static final int BG = Color.parseColor("#0f2a43");

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WebSettings s = getBridge().getWebView().getSettings();
    // масштабування двома пальцями
    s.setSupportZoom(true);
    s.setBuiltInZoomControls(true);
    s.setDisplayZoomControls(false);
    // музика може стартувати без дотику
    s.setMediaPlaybackRequiresUserGesture(false);

    // Відступи під рядок стану, нижню панель і клавіатуру вже виставляє Capacitor (плагін SystemBars).
    // Свій слухач відступів тут НЕ ставимо: клавіатура враховувалася б двічі, і при її відкритті
    // WebView стискався до смужки, а решта екрана ставала сірою.
    View decor = getWindow().getDecorView();
    decor.setBackgroundColor(BG);
    getWindow().setBackgroundDrawable(new ColorDrawable(BG));   // фон за смугами й під клавіатурою
    WindowInsetsControllerCompat ctl = WindowCompat.getInsetsController(getWindow(), decor);
    if (ctl != null) {
      ctl.setAppearanceLightStatusBars(false);     // світлі значки на темному фоні
      ctl.setAppearanceLightNavigationBars(false);
    }
  }
}
