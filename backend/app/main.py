from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import accounts, transactions, ledger

app = FastAPI(title='The Ladger API', description='Double entry accounting system')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://your-frontend-domain.com'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(ledger.router)

@app.get('/health')
def health_check():
    return {'status': 'ok'}