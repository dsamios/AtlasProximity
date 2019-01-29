@extends('adminlte::page')

@section('title', 'Server Pings')

@section('content_header')
    <h1>Server Pings</h1>
@stop

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-sm-12">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Server Pings</h3>
                        {{--<div class="box-tools pull-right">--}}
                        {{--<a href="{{ route('faq.create') }}" class="btn btn-box-tool">--}}
                        {{--<i class="fa fa-plus"></i>--}}
                        {{--</a>--}}
                        {{--</div>--}}
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <div class="row">
                            <div class="col-sm-12">
                                <table id="table" style="width: 100%">
                                    <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">IP</th>
                                        <th scope="col">Port</th>
                                        <th scope="col">Region</th>
                                        <th scope="col">Gamemode</th>
                                        <th scope="col">Coordinate</th>
                                        <th scope="col">Online</th>
                                        <th scope="col">Players</th>
                                        <th scope="col">Created</th>
                                    </tr>
                                    </thead>
                                    <tbody>


                                    @foreach ($pings as $ping)
                                        <tr>
                                            <th scope="row">{{ $ping->id }}</th>
                                            <td>{{ $ping->ip }}</td>
                                            <td>{{ $ping->port }}</td>
                                            <td>{{ $ping->region }}</td>
                                            <td>{{ $ping->gamemode }}</td>
                                            <td>{{ $ping->coordinates }}</td>
                                            <td>{{ $ping->online }}</td>
                                            <td>{{ $ping->players }}</td>
                                            <td>{{ $ping->created_at->diffForHumans() }}</td>
                                        </tr>
                                    @endforeach

                                    </tbody>
                                </table>


                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->
                    </div>
                    <!-- ./box-body -->
                </div>

                {{--<div class="card">--}}
                {{--<div class="card-header d-flex justify-content-between">--}}
                {{--<span>API keys</span>--}}
                {{--</div>--}}

                {{--<div class="card-body">--}}
                {{--</div>--}}
                {{--</div>--}}
            </div>
        </div>
    </div>
@stop

@section('js')
    <script>
        $(document).ready(function () {
            $('#table').DataTable({
                'order': [[0, 'desc']],
            });
        });
    </script>
@stop