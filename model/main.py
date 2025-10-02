from translation.translator import get_translator

translator = get_translator()

if __name__ == "__main__":
    test_text = "ТУТ ДОЛЖЕН БЫТЬ ТЕСТ"
    print('\033[92m' + translator(test_text) + '\033[0m')