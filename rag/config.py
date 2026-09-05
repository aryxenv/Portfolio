import os

# ---------------------------------------------------------------------------
# Configuration Constants
# ---------------------------------------------------------------------------

DEFAULT_SEARCH_ENDPOINT = os.getenv(
    "AZURE_SEARCH_ENDPOINT", "https://ais-portfolio.search.windows.net"
)
DEFAULT_INDEX_NAME = os.getenv("AZURE_SEARCH_INDEX_NAME", "ais-portfolio")
DEFAULT_FOUNDRY_PROJECT_ENDPOINT = os.getenv(
    "AZURE_FOUNDRY_PROJECT_ENDPOINT",
    "https://ai-portfolio-resource.services.ai.azure.com/api/projects/ai-portfolio",
)
DEFAULT_AZURE_OPENAI_BASE_URL = os.getenv(
    "AZURE_OPENAI_BASE_URL",
    "https://ai-portfolio-resource.openai.azure.com/openai/v1",
)
DEFAULT_EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL", "text-embedding-3-large"
)
EMBEDDING_DIMENSIONS = 3072
EMBEDDING_BATCH_SIZE = int(os.getenv("EMBEDDING_BATCH_SIZE", "50"))
UPLOAD_BATCH_SIZE = int(os.getenv("UPLOAD_BATCH_SIZE", "100"))

