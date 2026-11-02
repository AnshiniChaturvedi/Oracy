
from io import BytesIO

import fitz
from docx import Document


def extract_resume_text(
    file_bytes: bytes,
    filename: str,
) -> str:
    extension = filename.lower().rsplit(".", 1)[-1]

    if extension == "pdf":
        with fitz.open(
            stream=file_bytes,
            filetype="pdf",
        ) as pdf:
            text = "\n".join(
                page.get_text()
                for page in pdf
            )

    elif extension == "docx":
        document = Document(BytesIO(file_bytes))

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
        ]

        table_text = [
            cell.text
            for table in document.tables
            for row in table.rows
            for cell in row.cells
        ]

        text = "\n".join(paragraphs + table_text)

    else:
        raise ValueError(
            "Only PDF and DOCX files are supported."
        )

    if not text.strip():
        raise ValueError(
            "No readable text found in resume."
        )

    return text
