import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[dkMakeRed]'
})
export class MakeRedDirective implements OnInit {
  @Input() color: string;

  constructor(private elem: ElementRef) {
  }

  ngOnInit() {
    this.elem.nativeElement.style.color = this.color;
  }

}
