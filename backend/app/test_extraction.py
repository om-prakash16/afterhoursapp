from app.services.extraction_service import extraction_service

def test_extraction():
    test_messages = [
        "I love cricket and I’m stressed",
        "I enjoy coding in python and I feel happy today",
        "I am so frustrated with this traffic, but I love listening to music",
        "It's just an okay day, nothing special."
    ]

    for msg in test_messages:
        result = extraction_service.extract_insights(msg)
        print(f"Input: \"{msg}\"")
        print(f"Result: {result}")
        print("-" * 30)

if __name__ == "__main__":
    test_extraction()
