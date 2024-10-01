from transformers import pipeline

summarizer = pipeline("summarization")
paraphraser = pipeline("text2text-generation", model="tuner007/pegasus_paraphrase")

def summarize_text(text, max_length=150, min_length=50):
    """
    Summarize the given text using the Hugging Face transformers library.
    """
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
    return summary[0]['summary_text']

def paraphrase_text(text, max_length=100):
    """
    Paraphrase the given text using the Hugging Face transformers library.
    """
    paraphrased = paraphraser(text, max_length=max_length, num_return_sequences=1)
    return paraphrased[0]['generated_text']