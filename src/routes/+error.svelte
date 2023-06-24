<script>
    import { page } from "$app/stores";
</script>

<main>
    <h1>{$page.status}</h1>
    <p>{$page.error.message}</p>
    <p>새로고침 이후에도 증상이 지속되면 연락하기 메뉴의 연락처로 오류를 제보해주세요. 감사합니다.</p>
    <p><a href={$page.url.origin}>홈으로 돌아가기</a></p>
</main>

<style>
    p {
        margin: 0.5em 0;
    }

    h1 {
        margin: 0;
    }

    main {
        padding: 1em;
    }
</style>