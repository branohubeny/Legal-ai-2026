Android Studio skeleton for Legal AI 2026

Open this folder in Android Studio. The app uses Retrofit + Moshi + Coroutines and expects the backend at http://10.0.2.2:8000/ when running on the emulator.

To run
1. Start the backend: python -m uvicorn apps.api.main:app --reload
2. Open this project in Android Studio and let it sync Gradle
3. Run on emulator (emulator uses 10.0.2.2 to reach host localhost)
