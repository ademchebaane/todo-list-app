# Todo List — Android APK

A simple Todo List app made with HTML, CSS and JavaScript and packaged for Android with Capacitor.

## Included

- Add tasks
- Mark tasks complete
- All / Active / Completed filters
- Progress percentage
- Clear completed tasks
- Tasks saved locally on the device with `localStorage`
- Mobile-friendly interface

## Get the APK with GitHub Actions

1. Create an empty GitHub repository.
2. Upload all files from this folder.
3. Push the project to the `main` branch.
4. Open the repository's **Actions** tab.
5. Open **Build Android APK**.
6. Open the completed workflow run.
7. Download the `todo-list-debug-apk` artifact.
8. Extract it and install `app-debug.apk` on your Android phone.

The workflow builds a debug APK automatically whenever you push to `main` (or `master`), and it can also be started manually with **Run workflow**.

## Build locally

Install Node.js and Android Studio with an Android SDK, then run:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

The APK will be at:

`android/app/build/outputs/apk/debug/app-debug.apk`
