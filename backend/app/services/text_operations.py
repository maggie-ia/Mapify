from .text_processing import (
    summarize_text, paraphrase_text, synthesize_text, 
    extract_relevant_phrases, generate_concept_map, 
    translate_text, solve_problem, check_grammar
)

def process_text(operation, text, target_language=None):
    operations = {
        'summarize': lambda: summarize_text(text),
        'paraphrase': lambda: paraphrase_text(text),
        'synthesize': lambda: synthesize_text(text),
        'relevantPhrases': lambda: extract_relevant_phrases(text),
        'conceptMap': lambda: generate_concept_map(text),
        'translate': lambda: translate_text(text, target_language),
        'problemSolving': lambda: solve_problem(text),
        'grammarCheck': lambda: check_grammar(text)
    }
    
    if operation not in operations:
        raise ValueError(f"Operación no soportada: {operation}")
    
    return operations[operation]()