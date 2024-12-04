# HTML is a programming Language

With the power of web components, HTML really can be a programming language.

## Features

### Conditional Statements

```html
<if- (="2 + 2 === 4")>
  <console- log(="Hello World")></console->
</if->
```

### Loops

```html
<ul>
  <for- (="item of [1, 2, '😅', 4, 5]")>
    <li>Item {item}</li>
    <console- log(="Logging {item}")></console->
  </for->
</ul>
```

### Pattern Matching

```html
<ul>
  <for- (="salary of [1e5, 2e5, 3e5, 4e5]" )>
    <if- (="{salary} < 2e5" )>
      <li>ngmi with only ${salary} 😭</li>
    </if->
    <else-if- (="{salary} < 3e5" )>
      <li>Scraping by with ${salary} 🫥</li>
    </else-if->
    <else-if- (="{salary} < 4e5" )>
      <li>${salary} is ok, I guess 😏</li>
    </else-if->
    <else->
      <li>Retire already, moneybags 🤑</li>
    </else->
  </for->
</ul>
```

### Functions

```html
<function- fizz-buzz(="num" )>
  <if- (="{num} % 15 === 0" )>
    <console- log(="{num}: FizzBuzz" )></console->
  </if->
  <else-if- (="{num} % 3 === 0" )>
    <console- log(="{num}: Fizz" )></console->
  </else-if->
  <else-if- (="{num} % 5 === 0" )>
    <console- log(="{num}: Buzz" )></console->
  </else-if->
  <else->
    <console- log(="{num}" )></console->
  </else->
</function->

<for- (="i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" )>
  <call- fizz-buzz(="{i}" )></call->
</for->
```

#### Functions with Return Values

```html
<function- is-great(="platform" )>
  <return->'{platform}' === '🦋'</return->
</function->

<const- platform="'🦋'"></const->
<const- great="is-great({platform})"></const->
<if- (="{great}" )>
  <console- log(="{platform} is great!" )></console->
</if->
<else->
  <console- log(="{platform} is dumb." )></console->
</else->
```

## Project Goals

- Write this library using itself.
