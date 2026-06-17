import torch
from PIL import Image
from transformers.models.lighton_ocr import LightOnOcrProcessor, LightOnOcrForConditionalGeneration


class OCRService:
    MAX_LENGTH = 2048
    LONGEST_EDGE = 1024

    def __init__(self, model_path: str):
        self.device = (
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        dtype = (
            torch.bfloat16
            if torch.cuda.is_available()
            else torch.float32
        )

        print(f"Loading OCR model from: {model_path}")

        self.processor = LightOnOcrProcessor.from_pretrained(
            model_path,
            trust_remote_code=True,
            local_files_only=True
        )

        self.model = (
            LightOnOcrForConditionalGeneration.from_pretrained(
                model_path,
                trust_remote_code=True,
                torch_dtype=dtype,
                local_files_only=True
            )
            .to(self.device)
        )

        self.model.eval()

        print("✅ OCR model loaded")

    def _prepare_inputs(self, image: Image.Image):

        messages = [
            {
                "role": "user",
                "content": [{"type": "image"}]
            }
        ]

        text = self.processor.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        inputs = self.processor(
            text=[text],
            images=[[image]],
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=self.MAX_LENGTH,
            size={"longest_edge": self.LONGEST_EDGE},
        )

        inputs = {
            k: v.to(self.device)
            for k, v in inputs.items()
        }

        if "pixel_values" in inputs and torch.cuda.is_available():
            inputs["pixel_values"] = inputs["pixel_values"].to(torch.bfloat16)

        return inputs

    @torch.no_grad()
    def recognize_pil(self, image: Image.Image) -> str:

        image = image.convert("RGB")

        inputs = self._prepare_inputs(image)

        outputs = self.model.generate(
            **inputs,
            max_new_tokens=1024,
            do_sample=True,
            temperature=0.7,
            top_p=0.95,
        )

        input_length = inputs["input_ids"].shape[1]

        generated_ids = outputs[0, input_length:]

        generated_text = self.processor.tokenizer.decode(
            generated_ids,
            skip_special_tokens=True
        )

        return generated_text.strip()

    def recognize(self, image_input) -> str:

        image = Image.open(image_input).convert("RGB")
        return self.recognize_pil(image)

    @torch.no_grad()
    def recognize_batch(self, image_paths: list[str]) -> list[str]:

        images = [
            Image.open(path).convert("RGB")
            for path in image_paths
        ]

        messages = [
            {
                "role": "user",
                "content": [{"type": "image"}]
            }
        ]

        text = self.processor.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        texts = [text] * len(images)

        inputs = self.processor(
            text=texts,
            images=[[img] for img in images],
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=self.MAX_LENGTH,
            size={"longest_edge": self.LONGEST_EDGE},
        )

        inputs = {
            k: v.to(self.device)
            for k, v in inputs.items()
        }

        if "pixel_values" in inputs and torch.cuda.is_available():
            inputs["pixel_values"] = inputs["pixel_values"].to(torch.bfloat16)

        outputs = self.model.generate(
            **inputs,
            max_new_tokens=1024,
            do_sample=True,
            temperature=0.7,
            top_p=0.95,
        )

        input_length = inputs["input_ids"].shape[1]

        generated_ids = outputs[:, input_length:]

        texts = self.processor.batch_decode(
            generated_ids,
            skip_special_tokens=True
        )

        return [t.strip() for t in texts]
