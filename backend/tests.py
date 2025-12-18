import pytest
import os
import json
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, MagicMock
from main import app
from api.base import NotFoundException
from schemas.base import TranslationResponse
from schemas.base import SentenceResponse
from schemas.base import BaseModelRead

client = TestClient(app)


@pytest.fixture
def mock_dictionary():
    return [
        {
            "original": "со̄кӣни",
            "translation": "бабочка-лимонница"
        },
        {
            "original": "тэмэн",
            "translation": "верблюд"
        },
        {
            "original": "тэ̄ӈку",
            "translation": "стул"
        },
        {
            "original": "тэӈнен",
            "translation": "этаж"
        }
    ]


@pytest.fixture
def mock_sentences():
    return [
        {
            "original": "улэнди дуилэчируэ",
            "translation": "хорошенько погадай"
        },
        {
            "original": "саман сэвэнчи",
            "translation": "шаманка сэвэнам"
        },
        {
            "original": "саман хусэ эденчи",
            "translation": "шаманка хозяину"
        },
    ]


@pytest.fixture
def russian_texts_for_several_translation():
    return [
        {
            "russian_original": "я вышел на двор своего дома",
            "attempt": 1,
            "nanai_translation": "эситэни дёгдоани исигохани"
        },
        {
            "russian_original": "я вышел на двор своего дома",
            "attempt": 2,
            "nanai_translation": "дяпагора дёгдоани дёгдоани"
        },
        {
            "russian_original": "я вышел на двор своего дома",
            "attempt": 3,
            "nanai_translation": "ми энухэ тулиэдуэ дёкчи дёкчи"
        },
        {
            "russian_original": "Ворона летела по небу и увидела лес в огне",
            "attempt": 1,
            "nanai_translation": "дэгдэку дэгдэчихэни дэгдэчихэни апсигохани"
        },
        {
            "russian_original": "Ворона летела по небу и увидела лес в огне",
            "attempt": 2,
            "nanai_translation": "дэгдэку дэгдэку дэгдэрухэни ичэгуй ичэгуйни"
        },
        {
            "russian_original": "Ворона летела по небу и увидела лес в огне",
            "attempt": 3,
            "nanai_translation": "дэгдэку дэгдэрухэни боа ичэхэни тулиэду тулиэду"
        },
    ]


@pytest.fixture
def random_russian_texts():
    return ["лошадь", "птица", "сожжённый дуб", "ложка", "человек тонет в реке"]


@pytest.fixture
def random_nanai_texts():
    return ["инэктэйдуэни", "нёани дюэр сэ", "наондёкан", "согдата", "ани бачихани"]


# тесты /dictionary/get-word
def test_get_word_status_code(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/get-word?word={pair['original']}")
        assert response.status_code == 200


def test_get_word_status_code_reverse(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/get-word?word={pair['translation']}")
        assert response.status_code == 200


def test_get_word_original(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/get-word?word={pair['original']}")
        data = response.json()
        assert data["original"] == pair["original"]


def test_get_word_original_reverse(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/get-word?word={pair['translation']}")
        data = response.json()
        assert data["original"] == pair["translation"]


def test_get_word_translation(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/get-word?word={pair['original']}")
        data = response.json()
        assert pair["translation"] in data["translations"]


def test_get_word_translation_reverse(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/get-word?word={pair['translation']}")
        data = response.json()
        assert pair["translation"] in data["original"]


# тесты /dictionary/sentences
def test_sentences_code(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/sentences?word={pair['original']}")
        assert response.status_code == 200


def test_sentences_searched_word(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/sentences?word={pair['original']}")
        data = response.json()
        assert pair["original"] == data['searched_word']


def test_sentences_matches(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/sentences?word={pair['original']}")
        data = response.json()

        flag = False
        for match in data['matches']:
            if pair["original"] in match["original"]:
                flag = True
            else:
                flag = False

        assert flag


def test_sentences_matches_reverse(mock_dictionary):
    dictionary = mock_dictionary
    for pair in dictionary:
        response = client.get(f"/dictionary/sentences?word={pair['translation']}")
        data = response.json()

        flag = False
        for match in data['matches']:
            if pair["translation"] in match["translation"]:
                flag = True
            else:
                flag = False

        assert flag


# тесты /translation/to-russian
def test_translation_to_russian_status_code(mock_sentences):
    sentences = mock_sentences
    for pair in sentences:
        response = client.get(f"/translation/to-russian?nanai_text={pair['original']}&attempt=1")
        assert response.status_code == 200

def test_translation_to_russian(mock_sentences):
    for pair in mock_sentences:
        response = client.get(f"/translation/to-russian?nanai_text={pair['original']}&attempt=1")
        assert pair['translation'] == response.json()['text_to_translated']


def test_translation_to_russian_not_return_original(random_nanai_texts):
    attempts = [1, 2, 3]
    for word in random_nanai_texts:
        for attempt in attempts:
            response = client.get(f"/translation/to-russian?nanai_text={word}&attempt={attempt}")
            assert word != response.json()['text_to_translated']


# тесты /translation/to-nanai
def test_translation_to_nanai_status_code(mock_sentences):
    sentences = mock_sentences
    for pair in sentences:
        response = client.get(f"/translation/to-nanai?russian_text={pair['translation']}&attempt=1")
        assert response.status_code == 200


def test_translation_to_nanai_several_attempts(russian_texts_for_several_translation):
    for pair in russian_texts_for_several_translation:
        response = client.get(
            f"/translation/to-nanai?russian_text={pair['russian_original']}&attempt={pair['attempt']}")
        assert pair['nanai_translation'] == response.json()['text_to_translated']


def test_translation_to_nanai_several_attempts_different_results(russian_texts_for_several_translation):
    sentences_dictionary = {}
    for pair in russian_texts_for_several_translation:
        response = client.get(
            f"/translation/to-nanai?russian_text={pair['russian_original']}&attempt={pair['attempt']}")
        result = response.json()
        if pair["russian_original"] not in sentences_dictionary:
            sentences_dictionary[pair["russian_original"]] = {}
        sentences_dictionary[pair["russian_original"]][pair["attempt"]] = result["text_to_translated"]
    for key, value in sentences_dictionary.items():
        assert len(value.values()) == len(set(value.values()))

def test_translation_to_nanai_not_return_original(random_russian_texts):
    attempts = [1, 2, 3]
    for word in random_russian_texts:
        for attempt in attempts:
            response = client.get(f"/translation/to-nanai?russian_text={word}&attempt={attempt}")
            assert word != response.json()['text_to_translated']

