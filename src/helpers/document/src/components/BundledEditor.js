import React, { Component } from 'react'
import types from 'prop-types'
import AceEditor from 'react-ace'

import 'brace/mode/javascript'
// import 'brace/mode/markdown'
import 'brace/mode/css'
import 'brace/mode/jsx'
import 'brace/mode/sh'
// import 'brace/mode/html'
import 'brace/theme/vibrant_ink'
import 'brace/theme/dracula'
import 'brace/theme/tomorrow'
import 'brace/theme/solarized_light'
import 'brace/theme/solarized_dark'

class AceEditorWithDynamicMarkers extends AceEditor {
  componentDidMount() {
    super.componentDidMount()

    if (this.props.dynamicMarkers) {
      console.log('we got dynamic markers')
      this.handleDynamicMarkers()  
    }
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState)
  }

  handleDynamicMarkers(markers = []) {
    console.log('handling markers')
    // remove foreground markers
    let currentMarkers = this.editor.getSession().getMarkers(true);
    for (const i in currentMarkers) {
      if (currentMarkers.hasOwnProperty(i)) {
        this.editor.getSession().removeMarker(currentMarkers[i].id);
      }
    }
    // remove background markers except active line marker and selected word marker
    currentMarkers = this.editor.getSession().getMarkers(false);
    for (const i in currentMarkers) {
      if (
        currentMarkers.hasOwnProperty(i) &&
        currentMarkers[i].clazz !== "ace_active-line" &&
        currentMarkers[i].clazz !== "ace_selected-word"
      ) {
        this.editor.getSession().removeMarker(currentMarkers[i].id);
      }
    }
    // add new markers
    markers.forEach((marker) => this.editor.getSession().addDynamicMarker(marker, marker.inFront));
  }
}

export default class Editor extends Component {
  static contextTypes = {
    runtime: types.object,
  }

  static propTypes = {
    id: types.string.isRequired,
    mode: types.oneOf(['html', 'jsx', 'markdown', 'css', 'javascript', 'sh']),
    value: types.string.isRequired,
    innerProps: types.object,
    wrapperProps: types.object,
    headerProps: types.object,
    footerProps: types.object,
  }

  static defaultProps = {
    mode: 'jsx',
  }

  state = {
    loading: false,
    value: this.props.value,
  }

  // gives us access to their range class or other low level ace methods
  captureAce = (ace) => {
    const { beforeLoad } = this.props
    this.aceLibrary = ace

    const { Range } = ace.acequire("ace/range")

    this.Range = Range 

    if (beforeLoad) {
      beforeLoad(ace)
    }
  }

  handleRunResult = async (result = {}) => {
    const { handleResult } = this.props
    const { results = [], errors = [], hasErrors = !!errors.length, identifiers = [] } = result
    this.setState(
      {
        results,
        errors,
        hasErrors,
        identifiers,
      },
      () => handleResult && handleResult(this)
    )
  }

  handleCommand = async (command, options = {}) => {
    const { value } = this.state

    switch (command) {
      case 'run':
        const { handler } = options
        await handler(value).then(this.handleRunResult)
        break
      default:
        break
    }
  }

  handleChange = (newValue, ...args) => {
    const { getDocument, onChange } = this.props

    if (typeof onChange === 'function') {
      onChange(newValue, ...args)
    }

    if (typeof getDocument === 'function') {
      const lineNumber = this.props['data-line-number']

      if (lineNumber) {
        const doc = getDocument()
        doc.blockContent.set(lineNumber, newValue)
        const codeBlock = doc.codeBlocks.find(
          ({ position }) => position && position.start.line === lineNumber
        )

        if (codeBlock) {
          codeBlock.value = newValue
        }
      }
    }
  }

  handleLoad = editor => {
    const { onLoad } = this.props

    this.editor = editor

    if (onLoad) {
      onLoad(editor, this, this.props)
    }
  }

  addDynamicMarker = marker => {
    this.editor.session.addDynamicMarker(marker)
  }

  render() {
    const {
      header = () => null,
      footer = () => null,
      renderLoader = () => null,
      wrapperProps,
      headerProps,
      footerProps,
      innerProps,
    } = this.props

    const { loading, value } = this.state

    if (loading) {
      return renderLoader()
    }

    return (
      <div className="sk-editor-wrapper" {...wrapperProps}>
        <div className="sk-editor-header" {...headerProps} children={header(this)} />
        <div className="sk-inner-wrapper" {...innerProps}>
          <CodeEditor
            {...this.props}
            onBeforeLoad={this.captureAce}
            onChange={this.handleChange}
            onLoad={this.handleLoad}
            value={value}
          />
        </div>
        <div className="sk-editor-footer" {...footerProps} children={footer(this)} />
      </div>
    )
  }
}

function CodeEditor(props) {
  const { id, name = id, mode, value, ...rest } = props

  return (
    <AceEditorWithDynamicMarkers
      name={name}
      mode={mode}
      theme="dracula"
      width="100%"
      height="100px"
      {...value && { value: String(value).trim() }}
      highlightActiveLine={false}
      minLines={1}
      maxLines={Infinity}
      showGutter={false}
      showPrintMargin={false}
      tabSize={2}
      {...rest}
      style={{
        ...(rest.style || {}),
      }}
      editorProps={{ $blockScrolling: Infinity, ...(rest.editorProps || {}) }}
    />
  )
}
