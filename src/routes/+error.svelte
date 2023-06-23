<script>
    import { page } from "$app/stores";
</script>

<main>
    <h1>{$page.status}</h1>
    <p>{$page.error.message}</p>
    <p>새로고침 이후에도 증상이 지속되면 연락하기 메뉴의 연락처로 오류를 제보해주세요. 감사합니다.</p>
</main>

<style>
    main {
        padding: 0 1rem 0 1rem;
    }
</style>