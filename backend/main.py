from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"mesaj": "İş Ajanı backend çalışıyor 🚀"}
