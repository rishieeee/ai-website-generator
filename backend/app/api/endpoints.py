import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from bson import ObjectId
from ..schemas.generation import GenerationRequest, ProjectResponse, CodeStructure, SaveProjectRequest
from ..services.db_service import get_database

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/projects", response_model=ProjectResponse, status_code=201)
async def save_project(request: SaveProjectRequest, db=Depends(get_database)):
    """
    Save a generated website project to the database.
    The AI generation is handled client-side via Puter.js.
    """
    logger.info(f"Saving project: {request.prompt[:50]}...")
    
    try:
        # Validate code structure
        code_dict = {
            "html": request.code.html,
            "css": request.code.css,
            "js": request.code.js
        }
        
        project_doc = {
            "prompt": request.prompt,
            "code": code_dict,
            "created_at": datetime.utcnow()
        }
        
        new_project = await db["projects"].insert_one(project_doc)
        logger.info(f"Project saved with ID: {new_project.inserted_id}")
        
        return ProjectResponse(
            id=str(new_project.inserted_id),
            prompt=request.prompt,
            code=request.code,
            created_at=project_doc["created_at"].isoformat()
        )
    except Exception as e:
        logger.error(f"Error in save_project: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects", response_model=List[ProjectResponse])
async def list_projects(limit: int = 10, db=Depends(get_database)):
    """List all saved projects, ordered by creation date (newest first)."""
    if limit < 1 or limit > 50:
        limit = 10
    
    projects = []
    try:
        cursor = db["projects"].find().sort("created_at", -1).limit(limit)
        async for doc in cursor:
            projects.append(ProjectResponse(
                id=str(doc["_id"]),
                prompt=doc["prompt"],
                code=CodeStructure(**doc["code"]),
                created_at=doc["created_at"].isoformat()
            ))
    except Exception as e:
        logger.error(f"Error listing projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve projects")
    
    return projects


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db=Depends(get_database)):
    """Retrieve a single project by ID."""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID format")
    
    try:
        doc = await db["projects"].find_one({"_id": ObjectId(project_id)})
    except Exception as e:
        logger.error(f"Error fetching project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve project")
    
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(
        id=str(doc["_id"]),
        prompt=doc["prompt"],
        code=CodeStructure(**doc["code"]),
        created_at=doc["created_at"].isoformat()
    )


@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, db=Depends(get_database)):
    """Delete a project by ID."""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID format")
    
    try:
        result = await db["projects"].delete_one({"_id": ObjectId(project_id)})
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete project")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully", "id": project_id}
