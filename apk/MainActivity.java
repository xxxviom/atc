package io.github.xxxviom.atc;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private static final int BG = Color.parseColor("#0f2a43");

  // Справжні розміри системних панелей (у CSS-пікселях) для сторінок, у тому числі всередині iframe,
  // де env(safe-area-inset-*) не працює.
  private volatile float insTop = 0f, insBottom = 0f;

  public class InsetsBridge {
    @JavascriptInterface public float top() { return insTop; }
    @JavascriptInterface public float bottom() { return insBottom; }
  }

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

    // Вікно на весь екран: шпалери видно і під рядком стану, і під нижньою панеллю.
    // Відступи для вмісту рахує сама веб-сторінка (ui.js бере safe-area з основного документа);
    // клавіатуру обробляє вбудований SystemBars Capacitor.
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    View decor = getWindow().getDecorView();
    decor.setBackgroundColor(BG);
    getWindow().setBackgroundDrawable(new ColorDrawable(BG));
    getWindow().setStatusBarColor(Color.TRANSPARENT);
    getWindow().setNavigationBarColor(Color.TRANSPARENT);
    if (Build.VERSION.SDK_INT >= 29) {
      getWindow().setNavigationBarContrastEnforced(false);   // без сірої підложки під жестовою смугою
    }
    getBridge().getWebView().addJavascriptInterface(new InsetsBridge(), "AndroidInsets");
    View content = findViewById(android.R.id.content);
    ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
      Insets b = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
      float d = getResources().getDisplayMetrics().density;
      insTop = b.top / d;
      insBottom = b.bottom / d;
      return insets;                      // нічого не споживаємо: далі їх обробляє Capacitor
    });
    ViewCompat.requestApplyInsets(content);
    WindowInsetsControllerCompat ctl = WindowCompat.getInsetsController(getWindow(), decor);
    if (ctl != null) {
      ctl.setAppearanceLightStatusBars(false);     // світлі значки на темному фоні
      ctl.setAppearanceLightNavigationBars(false);
    }
  }
}
