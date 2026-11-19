package io.github.xxxviom.atc;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
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

    // Відступи під рядок стану, нижню панель, виріз і клавіатуру виставляємо самі (один раз).
    // Вбудована обробка Capacitor (SystemBars) вимкнена в capacitor.config.json: вона теж додавала
    // відступ під клавіатуру, і той рахувався двічі. Усередині iframe CSS-відступи (env) не працюють,
    // тому потрібен саме нативний відступ.
    View decor = getWindow().getDecorView();
    decor.setBackgroundColor(BG);
    getWindow().setBackgroundDrawable(new ColorDrawable(BG));   // фон за смугами й під клавіатурою
    WindowInsetsControllerCompat ctl = WindowCompat.getInsetsController(getWindow(), decor);
    if (ctl != null) {
      ctl.setAppearanceLightStatusBars(false);     // світлі значки на темному фоні
      ctl.setAppearanceLightNavigationBars(false);
    }
    View content = findViewById(android.R.id.content);
    ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
      Insets bars = insets.getInsets(
          WindowInsetsCompat.Type.systemBars()
              | WindowInsetsCompat.Type.displayCutout()
              | WindowInsetsCompat.Type.ime());
      v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
      return WindowInsetsCompat.CONSUMED;
    });
    ViewCompat.requestApplyInsets(content);
  }
}
