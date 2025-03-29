import gfm from '@bytemd/plugin-gfm'
import { Editor, Viewer } from '@bytemd/react'
import {useState} from "react";

const plugins = [
    gfm(),
]

const MarkDownEditor = () => {
    const [value, setValue] = useState('')

    return (
        <Editor
            value={value}
            plugins={plugins}
            onChange={(v) => {
                setValue(v)
            }}
        />
    )
}

export default MarkDownEditor;
