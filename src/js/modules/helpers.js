export function prettyCopy (str) {
  return str.replace(' `', '<span class="pre">')
            .replace('` ', '</span>')
}
