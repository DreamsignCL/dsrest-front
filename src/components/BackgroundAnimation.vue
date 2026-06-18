<template>
    <div class="background-animation">
        <div class="object-animation">
            <div class="object object1"></div>
            <div class="object object2"></div>
            <div class="object object3"></div>
            <div class="object object4"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BackgroundAnimation",
    };
</script>

<style lang="scss" scoped>
    .background-animation{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        z-index: -1;
        background: rgb(0,158,227);
        background: linear-gradient(37deg, rgba(0,158,227,1) 0%, rgba(0,87,125,1) 100%);
    }

    .object-animation{
        rotate: -30deg;

        .object{
            position: absolute;
            width:530px;
            height:160px;
            background-color:rgba(0, 158, 227,.3);
            border-radius: 50rem;
        }    
        .object1{
            animation: object1 5s ease infinite;
        }

        .object2{
            animation: object2 6s ease infinite;
        }

        .object3{
            animation: object3 7s ease infinite;
        }

        .object4{
            animation: object4 7s ease infinite;
        }
    }


    @keyframes object1 {
        0%   {left:-600px; top:0;}
        100%  {left:100%; top:0;}
    }

    @keyframes object2 {
        0%   {left:-700px; top:120px;}
        100%  {left:100%; top:120px;}
    }

    @keyframes object3 {
        0%   {left:-760px; top:400px;}
        100%  {left:300%; top:400px;}
    }

    @keyframes object4 {
        0%   {left:-800px; top:650px;}
        100%  {left:100%; top:650px;}
    }
</style>
