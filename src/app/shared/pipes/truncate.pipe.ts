import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords'
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, limit: number = 30): string {
    if (!value) return '';

    const words = value.split(/\s+/);

    if (words.length <= limit) return value;

    return words.slice(0, limit).join(' ') + '...';
  }
}
