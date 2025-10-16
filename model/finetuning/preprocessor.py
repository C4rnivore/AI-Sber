def preprocess_nanai_text(text):
    """
    Базовая предобработка для нанайского текста
    Поскольку нет готового лемматизатора, применяем базовую очистку
    """
    if not text or not isinstance(text, str):
        return ""

    # Приводим к нижнему регистру
    text = text.lower()

    # Удаляем лишние пробелы
    text = re.sub(r'\s+', ' ', text).strip()

    # Базовая токенизация (можно адаптировать под нанайский)
    tokens = nltk.word_tokenize(text)

    # Для нанайского пока просто возвращаем очищенный текст
    # В будущем можно добавить специализированную обработку
    return ' '.join(tokens)

def smart_preprocess_russian_text(text, lemmatize_ratio=0.5):
    """
    Лемматизируем только часть текста для баланса
    """
    if not text or not isinstance(text, str):
        return ""

    tokens = nltk.word_tokenize(text.lower())
    processed_tokens = []

    for token in tokens:
        # Пропускаем пунктуацию и числа
        if re.match(r'^[^\w\s]|\d+$', token):
            processed_tokens.append(token)
            continue

        # Лемматизируем только с определенной вероятностью
        if random.random() < lemmatize_ratio:
            parsed = morph_analyzer_ru.parse(token)[0]
            lemma = parsed.normal_form
            processed_tokens.append(lemma)
        else:
            processed_tokens.append(token)

    return ' '.join(processed_tokens)

def preprocess_russian_text(text):
    """Лемматизация русского текста"""
    if not text or not isinstance(text, str):
        return ""

    # Токенизируем
    tokens = nltk.word_tokenize(text.lower())

    # Лемматизируем каждый токен
    lemmatized_tokens = []
    for token in tokens:
        # Пропускаем пунктуацию и числа
        if re.match(r'^[^\w\s]|\d+$', token):
            lemmatized_tokens.append(token)
            continue

        # Лемматизация для русского
        parsed = morph_analyzer_ru.parse(token)[0]
        lemma = parsed.normal_form
        lemmatized_tokens.append(lemma)

    return ' '.join(lemmatized_tokens)