/* enhancements to native html elements */
const codeBlocks = document.getElementsByTagName('code');
console.log(codeBlocks);

Array.from(codeBlocks).forEach((codeBlock) => {
    const btn = document.createElement('button');
    btn.classList.add('inset');
    btn.innerText = 'Copy';
    codeBlock.appendChild(btn);

    btn.onclick = function(e) {
      const codeContents = e.target.parentElement.innerText;
      const code = codeContents.substring(0, codeContents.length - e.target.innerText.length);
      navigator.clipboard.writeText(code);
    };
});
