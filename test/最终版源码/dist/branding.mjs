// The supplied logo, with transparent padding framed by an SVG viewport.
// Independent layers retain the reference spacing; CSS tints only the wordmark.
export function repathLogo({markOnly=false,decorative=false}={}){
  return `<svg class="repath-logo ${markOnly?'repath-logo-mark':''}" viewBox="224 128 ${markOnly?'440':'1784'} 448" ${decorative?'aria-hidden="true"':'role="img" aria-label="RePath"'} focusable="false"><image class="repath-logo-symbol" href="assets/repath-logo.png" width="2172" height="724"/><g transform="translate(50 0)"><image class="repath-logo-type" href="assets/repath-logo.png" width="2172" height="724"/></g></svg>`;
}
