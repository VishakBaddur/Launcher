"""
RAG (Retrieval-Augmented Generation) service using ChromaDB.
Stores past startup analyses as vector embeddings and retrieves
similar analyses to use as context for new LLM pipeline runs.
"""
import os
import json
import hashlib
import chromadb
from chromadb.utils import embedding_functions
from typing import Dict, Any, List, Optional

# Use persistent storage so analyses survive restarts
CHROMA_PATH = os.path.join(os.path.dirname(__file__), 'chroma_db')

class RAGService:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=CHROMA_PATH)
        # Use ChromaDB's built-in sentence transformer embeddings (free, local)
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name="startup_analyses",
            embedding_function=self.embedding_fn,
            metadata={"hnsw:space": "cosine"}
        )

    def store_analysis(self, idea: str, analysis: Dict[str, Any]) -> bool:
        """Store a completed analysis in the vector DB."""
        try:
            doc_id = hashlib.md5(idea.lower().strip().encode()).hexdigest()
            document = f"""
Startup Idea: {idea}
Category: {analysis.get('category', '')}
Description: {analysis.get('description', '')}
Market Size: {analysis.get('market_size', '')}
Target Customers: {analysis.get('target_customers', '')}
Key Trends: {', '.join(analysis.get('key_trends', []))}
Strengths: {', '.join(analysis.get('success_factors', []))}
Weaknesses: {', '.join(analysis.get('swot', {}).get('weaknesses', []))}
Opportunities: {', '.join(analysis.get('swot', {}).get('opportunities', []))}
Threats: {', '.join(analysis.get('common_challenges', []))}
Competitive Advantage: {analysis.get('competitive_advantage', '')}
Recommendations: {', '.join(analysis.get('recommendations', []))}
""".strip()
            metadata = {
                'idea': idea,
                'category': analysis.get('category', ''),
                'market_size': str(analysis.get('market_size', '')),
                'target_customers': str(analysis.get('target_customers', '')),
            }
            # Upsert so re-analyzing the same idea updates it
            self.collection.upsert(
                ids=[doc_id],
                documents=[document],
                metadatas=[metadata]
            )
            return True
        except Exception as e:
            print(f"[RAG] Failed to store analysis: {e}")
            return False

    def retrieve_similar(self, idea: str, n_results: int = 3) -> List[Dict]:
        """Retrieve the most similar past analyses for a given idea."""
        try:
            count = self.collection.count()
            if count == 0:
                return []
            results = self.collection.query(
                query_texts=[idea],
                n_results=min(n_results, count),
                include=['documents', 'metadatas', 'distances']
            )
            similar = []
            for i, doc in enumerate(results['documents'][0]):
                distance = results['distances'][0][i]
                similarity = 1 - distance  # cosine similarity
                if similarity > 0.3:  # only return meaningfully similar results
                    similar.append({
                        'document': doc,
                        'metadata': results['metadatas'][0][i],
                        'similarity': round(similarity, 3)
                    })
            return similar
        except Exception as e:
            print(f"[RAG] Failed to retrieve similar analyses: {e}")
            return []

    def build_rag_context(self, idea: str) -> str:
        """Build a context string from similar past analyses."""
        similar = self.retrieve_similar(idea)
        if not similar:
            return ""
        context_parts = [
            f"Here are {len(similar)} similar startup analyses from our knowledge base to inform your analysis:\n"
        ]
        for i, item in enumerate(similar, 1):
            context_parts.append(
                f"--- Similar Analysis {i} (similarity: {item['similarity']}) ---\n"
                f"{item['document']}\n"
            )
        return "\n".join(context_parts)

    def get_stats(self) -> Dict:
        """Return stats about the vector DB."""
        return {
            'total_analyses': self.collection.count(),
            'db_path': CHROMA_PATH
        }

# Singleton instance
_rag_service = None

def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
