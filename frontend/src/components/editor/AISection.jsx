import useEditorText from "./useEditorText";
import AIPanel from "./AIPanel";

function AISection() {
    const getText = useEditorText();

    return <AIPanel getText={getText} />;
}

export default AISection;
