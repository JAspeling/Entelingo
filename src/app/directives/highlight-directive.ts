import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from "@angular/core";

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() searchedWords: string[];
  @Input() text: string;
  @Input() classToApply: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.searchedWords || !this.searchedWords.length || !this.classToApply) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.text);
      return;
    }

    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      this.getFormattedText()
    );
  }

  getFormattedText() {
    const regex = `(${this.searchedWords.map(w => `\\b${w}\\b`).join('|')})`;
    console.log(regex)
    const re = new RegExp(regex, 'g');

    return this.text?.replace(re, `<span class="${this.classToApply}">$1</span>`) || '';
  }
}
