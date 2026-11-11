# Сектори ACC — Android

Оболонка Capacitor навколо веб-застосунку з папки `../sektory`. Android-проєкт не зберігається в репозиторії,
його щоразу створює workflow `.github/workflows/sektory-apk.yml`.

APK завантажується зі сторінки **Releases → «Сектори ACC (APK)»** (файл `sektory-acc.apk`).
Збірка запускається автоматично після змін у `sektory/` або `sektory-android/` на гілці `main`
і вручну: Actions → «Сектори ACC — збірка APK» → Run workflow.

APK підписаний debug-ключем, тож перед установкою треба дозволити встановлення з невідомих джерел.
