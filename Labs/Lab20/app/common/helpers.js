import hbs from 'hbs';

export function cancelOperation() {
    return new hbs.SafeString(
        `<a class="button-style" href="/users">
            Отказаться
        </a>`
    );
}