import pytest
from httpx import AsyncClient
from app.models.user import User, UserRole
from app.core.security import create_access_token
from tests.conftest import TestingSessionLocal


@pytest.mark.asyncio
async def test_researcher_dashboard_authenticated(client: AsyncClient, test_user: dict):
    token = create_access_token(data={"sub": str(test_user["id"]), "email": test_user["email"]})
    headers = {"Authorization": f"Bearer {token}"}

    response = await client.get("/api/v1/dashboard/researcher", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["user_id"] == test_user["id"]
    assert "funding_recommendations" in data
    assert "research_trends" in data
    assert "publication_analytics" in data
    assert "patent_insights" in data
    assert "innovation_score" in data
    if data["innovation_score"]:
        assert "overall_score" in data["innovation_score"]
        assert "estimated_trl" in data["innovation_score"]
        assert "research_novelty" in data["innovation_score"]


@pytest.mark.asyncio
async def test_startup_dashboard(client: AsyncClient, test_user: dict):
    token = create_access_token(data={"sub": str(test_user["id"]), "email": test_user["email"]})
    headers = {"Authorization": f"Bearer {token}"}

    response = await client.get("/api/v1/dashboard/startup?domain=Artificial%20Intelligence", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["focus_domain"] == "Artificial Intelligence"
    assert "funding_opportunities" in data
    assert "technology_opportunities" in data
    assert "competitor_patent_intelligence" in data
    assert "commercialization_insights" in data
    assert "commercialization_readiness_score" in data


@pytest.mark.asyncio
async def test_innovation_manager_dashboard(client: AsyncClient, test_user: dict):
    token = create_access_token(data={"sub": str(test_user["id"]), "email": test_user["email"]})
    headers = {"Authorization": f"Bearer {token}"}

    response = await client.get("/api/v1/dashboard/innovation-manager", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]

    assert "portfolio_projects" in data
    assert "pipeline_tracking" in data
    assert "technology_trend_monitoring" in data
    assert "funding_analytics" in data
    assert data["total_portfolio_projects"] >= 1


@pytest.mark.asyncio
async def test_admin_dashboard_authorization(client: AsyncClient, test_user: dict):
    # Regular user attempting admin dashboard should be forbidden (403)
    user_token = create_access_token(data={"sub": str(test_user["id"]), "email": test_user["email"]})
    user_headers = {"Authorization": f"Bearer {user_token}"}
    res_forbidden = await client.get("/api/v1/dashboard/admin", headers=user_headers)
    assert res_forbidden.status_code == 403

    # Create admin user
    async with TestingSessionLocal() as session:
        admin = User(
            email="platform_admin@gov.in",
            hashed_password="hashed_pw_test",
            full_name="Chief Administrator",
            role=UserRole.ADMINISTRATOR,
            is_active=True,
            is_superuser=True,
        )
        session.add(admin)
        await session.commit()
        await session.refresh(admin)

        admin_token = create_access_token({"sub": str(admin.id), "email": admin.email})

    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    res_ok = await client.get("/api/v1/dashboard/admin", headers=admin_headers)
    assert res_ok.status_code == 200
    admin_data = res_ok.json()["data"]

    assert "platform_analytics" in admin_data
    assert "user_distribution" in admin_data
    assert "recommendation_monitoring" in admin_data
    assert "system_health" in admin_data


@pytest.mark.asyncio
async def test_unified_overview_auto_detection(client: AsyncClient, test_user: dict):
    token = create_access_token(data={"sub": str(test_user["id"]), "email": test_user["email"]})
    headers = {"Authorization": f"Bearer {token}"}

    response = await client.get("/api/v1/dashboard/overview?view=researcher", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["current_dashboard_view"] == "researcher"
    assert data["researcher_dashboard"] is not None
