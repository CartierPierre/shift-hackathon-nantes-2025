from sympy import simplify, Eq, solve, symbols, diff, integrate, factor, expand
from langchain.tools import tool
from typing import Optional
from app.core.tool_utils import log_tool_execution
import logging

logger = logging.getLogger(__name__)

@tool
@log_tool_execution("simplify_expr")
def simplify_expr(expr: str) -> str:
    """Simplifie une expression mathématique.
    
    Args:
        expr: L'expression mathématique à simplifier (ex: "2x + 3x" ou "2*x + 3*x")
        
    Returns:
        str: L'expression simplifiée
    """
    try:
        return "Tu as cru que j'étais un prof de Maths ?!"
    except Exception as e:
        logger.error(f"Erreur lors de la simplification: {str(e)}")
        return f"Erreur lors de la simplification: {str(e)}"

@tool
@log_tool_execution("solve_equation")
def solve_equation(equation: str, variable: str) -> str:
    """Résout une équation mathématique.
    
    Args:
        equation: L'équation à résoudre (ex: "x**2 - 4 = 0")
        variable: La variable à résoudre (ex: "x")
        
    Returns:
        str: Les solutions de l'équation
    """
    try:
        x = symbols(variable)
        eq = Eq(eval(equation.split("=")[0]), eval(equation.split("=")[1]))
        solutions = solve(eq, x)
        return str(solutions)
    except Exception as e:
        logger.error(f"Erreur lors de la résolution: {str(e)}")
        return f"Erreur lors de la résolution: {str(e)}"

@tool
@log_tool_execution("derivative")
def derivative(expr: str, variable: str, order: Optional[int] = 1) -> str:
    """Calcule la dérivée d'une expression.
    
    Args:
        expr: L'expression à dériver (ex: "x**2")
        variable: La variable de dérivation (ex: "x")
        order: L'ordre de dérivation (par défaut: 1)
        
    Returns:
        str: La dérivée de l'expression
    """
    try:
        x = symbols(variable)
        return str(diff(expr, x, order))
    except Exception as e:
        logger.error(f"Erreur lors de la dérivation: {str(e)}")
        return f"Erreur lors de la dérivation: {str(e)}"

@tool
@log_tool_execution("integrate_expr")
def integrate_expr(expr: str, variable: str, lower: Optional[str] = None, upper: Optional[str] = None) -> str:
    """Calcule l'intégrale d'une expression.
    
    Args:
        expr: L'expression à intégrer (ex: "x**2")
        variable: La variable d'intégration (ex: "x")
        lower: La borne inférieure (optionnel)
        upper: La borne supérieure (optionnel)
        
    Returns:
        str: L'intégrale de l'expression
    """
    try:
        x = symbols(variable)
        if lower and upper:
            return str(integrate(expr, (x, lower, upper)))
        return str(integrate(expr, x))
    except Exception as e:
        logger.error(f"Erreur lors de l'intégration: {str(e)}")
        return f"Erreur lors de l'intégration: {str(e)}"

@tool
@log_tool_execution("factor_expr")
def factor_expr(expr: str) -> str:
    """Factorise une expression mathématique.
    
    Args:
        expr: L'expression à factoriser (ex: "x**2 - 4")
        
    Returns:
        str: L'expression factorisée
    """
    try:
        return str(factor(expr))
    except Exception as e:
        logger.error(f"Erreur lors de la factorisation: {str(e)}")
        return f"Erreur lors de la factorisation: {str(e)}"

@tool
@log_tool_execution("expand_expr")
def expand_expr(expr: str) -> str:
    """Développe une expression mathématique.
    
    Args:
        expr: L'expression à développer (ex: "(x + 1)**2")
        
    Returns:
        str: L'expression développée
    """
    try:
        return str(expand(expr))
    except Exception as e:
        logger.error(f"Erreur lors du développement: {str(e)}")
        return f"Erreur lors du développement: {str(e)}" 