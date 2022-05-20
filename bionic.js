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
   
    let { currentNode: node } = walker
    let { textContent: text } = node

    // Split the text by spaces
    let html = text.split(' ').map( word => {

      // If the word is shorter than 4 characters, return it as is
      if ( word.length < 4 )
        return word
      
      let partToBolden = word.slice(0, Math.ceil(word.length * settings.boldnessCutoff))
      let currentWeight = getComputedStyle(node.parentElement).fontWeight
      let newWeight = parseInt(currentWeight) + settings.boldnessIncrement

      return `<span style="font-weight: ${newWeight}">${partToBolden}</span>${word.slice(partToBolden.length)}`

    }).join(' ')

    // console.log(newText)

    // If the text changed, create a span to hold the bionic text and replace the text node with it
    if ( html !== text )
      setTimeout( () => {
        let span = document.createElement('span')
        span.innerHTML = html
        node.parentNode.replaceChild(span, node)
      }, 0)

  }

}

let bionicEnabled = false

// Bind the enableBionic function to the hotkey
document.addEventListener('keydown', event => {
  
  let { hotkey: { key, modifier } } = settings
  
  if ( event.key === key && event[modifier + 'Key'] ) {
    if ( !bionicEnabled ) {
      enableBionic()
      bionicEnabled = true
      console.log('Bionic Reading enabled. Refresh the page to disable.') 
    } else {
      // Show a message to the user that they need to refresh the page to disable bionic reading
      alert('Bionic Reading is already enabled. Refresh the page to disable.')
    }
  }
  
})