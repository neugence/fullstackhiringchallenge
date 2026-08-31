from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_manager import ws_manager

router = APIRouter(tags=["WebSocket Relay"])

@router.websocket("/ws/{document_id}")
async def websocket_endpoint(websocket: WebSocket, document_id: str):
    await ws_manager.connect(websocket, document_id)
    try:
        while True:
            data = await websocket.receive_bytes()
            await ws_manager.broadcast_bytes(data, document_id, sender=websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, document_id)
    except Exception:
        ws_manager.disconnect(websocket, document_id)
