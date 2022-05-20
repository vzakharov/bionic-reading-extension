// Function to enable bionic reading for all text nodes
function enableBionic() {

  // Create a walker to find all text nodes
  let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, 
    node => {
      // Only accept textnodes whose element parent is visible
      if ( getComputedStyle(node.parentElement).display !== 'none' ) {
        return NodeFilter.FILTER_ACCEPT
      }
      return NodeFilter.FILTER_REJECT
    }, false)

  // Loop through all text nodes
  while ( walker.nextNode() ) {
   
    // Make the text node bionic: split the text by words and make the first part of each word a bit bolder
    let { currentNode: node } = walker
    let { textContent: text } = node
    let newText = text.split(/\b/).map( word => {

      // If this is not a word, just return it
      if ( !word.match(/\w/) ) return word

      let partToBolden = word.slice(0, Math.ceil(word.length * settings.boldnessCutoff))
      let currentWeight = getComputedStyle(node.parentElement).fontWeight
      let newWeight = parseInt(currentWeight) + settings.boldnessIncrement

      return `<span style="font-weight: ${newWeight}">${partToBolden}</span>${word.slice(partToBolden.length)}`

    }).join('')

    console.log(newText)

    // If the text changed, create a span to hold the bionic text and replace the text node with it
    if ( newText !== text )
      setTimeout( () => {
        let span = document.createElement('span')
        span.innerHTML = newText
        node.parentNode.replaceChild(span, node)
      }, 0)

  }

}

let bionicEnabled = false

// Bind the enableBionic function to the hotkey
document.addEventListener('keydown', event => {
  
  let { hotkey: { key, modifier } } = settings
  
  if ( event.key === key && event[modifier + 'Key'] && !bionicEnabled ) {
    console.log('Enabling bionic reading')
    bionicEnabled = true
    enableBionic()
  }
  
})