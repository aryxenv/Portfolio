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

# Cosmos DB Defaults
DEFAULT_COSMOS_ACCOUNT_NAME = os.getenv("AZURE_COSMOS_ACCOUNT_NAME", "cdb-portfolio")
DEFAULT_COSMOS_ENDPOINT = os.getenv(
    "AZURE_COSMOS_ENDPOINT", f"https://{DEFAULT_COSMOS_ACCOUNT_NAME}.documents.azure.com:443/"
)
DEFAULT_COSMOS_DATABASE_NAME = os.getenv("AZURE_COSMOS_DATABASE_NAME", "portfolio")
DEFAULT_COSMOS_CONTAINER_NAME = os.getenv("AZURE_COSMOS_CONTAINER_NAME", "chunks")
DEFAULT_COSMOS_RESOURCE_GROUP = os.getenv("AZURE_COSMOS_RESOURCE_GROUP", "portfolio")
DEFAULT_AZURE_SUBSCRIPTION_ID = os.getenv("AZURE_SUBSCRIPTION_ID", "3aaf8f72-92bf-4f78-832b-80662cd35481")

