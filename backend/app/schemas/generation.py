from pydantic import BaseModel, Field, field_validator


class GenerationRequest(BaseModel):
    """Legacy request model - kept for compatibility."""
    prompt: str = Field(..., min_length=10, max_length=2000)

    @field_validator('prompt')
    @classmethod
    def validate_prompt(cls, v):
        if not v or not v.strip():
            raise ValueError('Prompt cannot be empty')
        return v.strip()


class CodeStructure(BaseModel):
    """Structure for generated website code."""
    html: str = Field(..., min_length=1)
    css: str = Field(..., min_length=1)
    js: str


class SaveProjectRequest(BaseModel):
    """Request model for saving a generated project."""
    prompt: str = Field(..., min_length=10, max_length=2000)
    code: CodeStructure

    @field_validator('prompt')
    @classmethod
    def validate_prompt(cls, v):
        if not v or not v.strip():
            raise ValueError('Prompt cannot be empty')
        return v.strip()


class ProjectResponse(BaseModel):
    """Response model for project data."""
    id: str
    prompt: str
    code: CodeStructure
    created_at: str
