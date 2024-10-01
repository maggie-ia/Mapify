from transformers import PegasusForConditionalGeneration, PegasusTokenizer

def paraphrase_text(text):
    """
    Paraphrase the given text using the Pegasus model.
    
    Args:
    text (str): The text to paraphrase.
    
    Returns:
    str: The paraphrased text.
    """
    model_name = "tuner007/pegasus_paraphrase"
    tokenizer = PegasusTokenizer.from_pretrained(model_name)
    model = PegasusForConditionalGeneration.from_pretrained(model_name)
    
    inputs = tokenizer(text, truncation=True, padding="longest", return_tensors="pt")
    outputs = model.generate(**inputs, max_length=60, num_return_sequences=1)
    
    paraphrased_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    return paraphrased_text