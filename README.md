# Проект земельного господарства на NestJs + MongoDB.

## Встановлення

Перед клонуванням програми потурбуйтеся, щоб були встановлені наступні речі:
- [yarn](https://yarnpkg.com/cli/install)
- [node](https://nodejs.org/en/download/releases/) v16

Запустіть наступні команди:
1. `git clone {project url}`
2. `cd garden-api`

## Посилання

- [Jira](https://mykolaromaniv.atlassian.net/jira/software/projects/SADOK/boards/2)
- [GitHub](https://github.com/mysamyr/garden-API)
- [MongoDB Doc](https://www.mongodb.com/docs/)
- [NestJs Doc](https://docs.nestjs.com/)

## Бізнес логіка
1. є 2 види дерев - вишні і яблуні
2. кожного виду є по 10 сортів
3. кожен сорт має свою ціну (можуть повторюватися)
4. вишням тре 40 см квадратних а яблуням 60 см квадратних (посадка)
5. вишні можна продавати починаючи з 2 року, яблуні з 3 року (саджанці)
6. під вишні тре вносити 4 види добрив в рік, під яблуні 6 видів
   (дерево визначає назву добрива, місяць і кількість)
7. статистика показує що 0,15% яблунь гине в рік (заморозки та інше), а вишень лише 0,08%.
8. і вишні і яблуні потрібно обрізати 2 рази на рік (обрізка коштує однаково не залежно від дерева)

Треба зробити 2 частини, _адмінку_ і _користувача інтерфейс_:

#### Користувача буде цікавити:
1. яка кількість дерев повинна бути посаджена на певній площі, щоб отримати через (2 або 3 роки) певний прибуток
2. яка оптимальна кількість дерев може бути посаджена на заданій площі
3. яка собівартість 1 дерева вказуючи вартість обрізки + ціни добрив
4. який прибуток від реалізації всіх дерев, що будуть посаджені цього року через (2 і 3 роки) на певній площі (вишні і яблуні - 50%-50%)

#### Адмінка повинна давати змогу:
- заповнювати дані (тип дерева, сорти, площа потрібна під посадку, термін вирощування, добрива, які добрива для яких дерев, коли їх тре вносити й коли дерева тре обрізати, вартість робіт в розрахунку на 1 дерево)
- виводити дані,
- шукати дані,
- редагувати дані,
- а також записувати всі зміни зроблені через адмінку і мати механізм ролбеку таких змін,
- наш профіт,

## Endpoints

- get planted trees GET /tree
- get sold trees GET /tree/sold
- get planted tree GET /tree/:id
- plant trees POST /tree
- add action PUT /tree

- get sorts GET /sort
- get disabled sorts GET /sort/disabled
- add sort POST /sort
- update sort PUT /sort/:id
- check if sort in use GET /sort/:name/in-use

- get prices GET /price
- update price PUT /price/:id

- get amount for profit GET
- get amount by area GET
- get cost for 1 tree GET
- get expected income GET

## Notes
- Загальні дані про вид дерев зберігати в апі
- readyForSale обновляється при додаванні action
- місяці для fertilizers рахувати починаючи з 0 (0 - січень, 11 - грудень)
- Юзер приходить до нас і ми узгоджуємо прибуток від реалізації певного сорту (50%/50% вишні і яблуні).
- Юзер готовий дати певну суму грошей і питає який прибуток ми йому можемо принести, реалізувавши певні сорти дерев.
- (кількість дерев на всю суму
  - -> віднімаємо потенційно мертві
  - -> множимо на ціну реалізації
  - -> віднімаємо суму вкладених грошей
  - -> ділимо (70%/30%))

## ToDo
- add change user email/ password / phone_number (endpoints) + rollback
- add update price (+cost) for planting + rollback
- * add rollback possibility for price, sort (fertilizers)
- add temporary disabling some sorts
  - add new endpoints : getInactiveSorts, disable/unable sort, are u sure?
  - add new column for sort "active"
- add change sort name + update this sort for all plantings (+ rollback)