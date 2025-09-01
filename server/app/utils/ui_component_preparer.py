from app.schemas.ui_schema import UIComponent


def prepare_ui_components(ui_response):
    """
    Ensures ui_response is always a list of UIComponent objects,
    even if it's a single component.
    """
    if isinstance(ui_response, dict) and "ui_components" in ui_response:
        ui_list = ui_response["ui_components"]
    elif isinstance(ui_response, dict):
        ui_list = [ui_response]
    else:
        ui_list = ui_response

    return [UIComponent(**c) if isinstance(c, dict) else c for c in ui_list]
