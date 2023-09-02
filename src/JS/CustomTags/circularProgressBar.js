class CircularProgressBar extends HTMLElement {
    constructor() {
        super();

        this.classList.add("circular-progress-bar");

        this.style.setProperty("--outline-thickness", "1px");
        // this.style.setProperty("--outline-color", "#FFD369");

        this.style.setProperty("--thickness", "2rem");

        this.style.setProperty("--fill-color", "#FFD369");
        
        let size = this.getAttribute("size");

        this._createChildren(size);
    }

    setProgress(percent) {
        if (this.fill) {
            this.fill.style.setProperty("--dashStrokeOffset", this.fillOffset - (this.fillOffset * percent/100));
        }
    }

    setText(text) {
        this.text.innerText = text;
    }

    _createChildren(size)
    {
        let outer = this._createDiv("outer", this, size);
        let inner = this._createDiv("inner", outer, size);

        let thickness = this._convertToPixels(this.style.getPropertyValue("--thickness"));

        this.text = this._createDiv("innerText", this, null);

        this.appendChild(this._createCircleSVG(size, thickness));
    }
    _createDiv(className, parent, size) {
        let div = document.createElement("div");
        div.classList.add(className);
        div.style.setProperty("--size", size + "px")
        parent.appendChild(div);

        return div;
    }
    _createCircleSVG(size, thickness) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('width', size + "px");
        svg.setAttribute('height', size + "px");
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        linearGradient.setAttribute('id', 'GradientColor');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#e91e63');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#673ab7');
        
        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
        
        defs.appendChild(linearGradient);
        svg.appendChild(defs);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', size/2);
        circle.setAttribute('cy', size/2);
        circle.setAttribute('r', size/2 - thickness/3);
        circle.setAttribute('stroke-linecap', 'round');
        circle.style.setProperty("--size", size);

        circle.style.setProperty("--dashStrokeData", (size * 2 + (size - 100) + 72));
        circle.style.setProperty("--dashStrokeOffset", (size * 2 + (size - 100) + 72));
        
        this.fill = circle;
        this.fillOffset = (size * 2 + (size - 100) + 72);

        svg.appendChild(circle);
        
        return svg;
    }
    _convertToPixels(valueWithUnit) {
        const unitRegex = /(\d*\.?\d+)(px|rem|em|%)/;
        const match = valueWithUnit.match(unitRegex);
      
        if (!match) {
          throw new Error("Invalid input format");
        }
      
        const value = parseFloat(match[1]);
        const unit = match[2];
      
        const baseFontSize = 16; // Default base font size in pixels (adjust as needed)
      
        switch (unit) {
          case "rem":
            return value * baseFontSize;
          case "em":
            return value * baseFontSize; // Assuming 1em = 1rem = baseFontSize
          case "%":
            return value * 0.01 * baseFontSize; // Convert percentage to pixels
          case "px":
            return value; // Already in pixels
          default:
            throw new Error("Unsupported unit");
        }
      }
}

window.customElements.define('circular-progress-bar', CircularProgressBar);
