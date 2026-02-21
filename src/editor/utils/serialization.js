export function serialize(editorState) {

    return JSON.stringify(editorState);
  
  }
  
  export function deserialize(json) {
  
    return JSON.parse(json);
  
  }