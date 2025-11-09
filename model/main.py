from translation.translator import Translator

if __name__ == "__main__":
    # Создали переводчик на нанайский
    translator = Translator(target_language="nanai")
    translated_text = translator.translate("Тут текст для перевода")

    print('\033[92m' + translated_text + '\033[0m')