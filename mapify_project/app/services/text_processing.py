from transformers import pipeline

summarizer = pipeline("summarization")

def summarize_text(text, max_length=150, min_length=50):
    """
    Summarize the given text using the Hugging Face transformers library.
    """
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
    return summary[0]['summary_text']