"""
Materials Database Module

Zugriff auf die Materialdatenbank mit Absorptionskoeffizienten.
"""

from .repository import MaterialRepository, Material

__all__ = ["MaterialRepository", "Material"]
